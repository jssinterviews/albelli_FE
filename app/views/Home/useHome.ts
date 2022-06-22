import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { queueNotification } from "../../store/reducers/notifications";

type IMoves = "right" | "left" | "up" | "down";

type IRescale = "in" | "out";

const MOVES_MEASURE = 5;

const locales = {
  outOfBoundsImageError: "Image must not be smaller than the canvas",
  imageLoadedSuccessfully: "Image loaded successfully",
};

const useHome = () => {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageObject, setImageObject] = useState<CanvasImageSource>();
  const [imageData, setImageData] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageCoords, setImageCoords] = useState({ x: 0, y: 0 });
  const [imagesDimensions, setImagesDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [imageRenderDimensions, setImageRenderDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>();

  useEffect(() => {
    if (canvasRef?.current) {
      setCanvasContext(canvasRef.current.getContext("2d"));
    }
  }, []);

  const saveData = () => {
    const object = {
      canvas: {
        width: imageRenderDimensions.width,
        height: imageRenderDimensions.height,
        photo: {
          id: `${imageName}_albelli`,
          data: imageData,
          width: imagesDimensions.width,
          height: imagesDimensions.height,
          x: imageCoords.x,
          y: imageCoords.y,
        },
      },
    };
    const a = document.createElement("a");
    a.href = `data:text/plain,${JSON.stringify(object)}`;
    a.download = `${object.canvas.photo.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const coordsGeneratorByPosition = {
    left: { x: imageCoords.x - MOVES_MEASURE, y: imageCoords.y },
    right: { x: imageCoords.x + MOVES_MEASURE, y: imageCoords.y },
    up: { x: imageCoords.x, y: imageCoords.y - MOVES_MEASURE },
    down: { x: imageCoords.x, y: imageCoords.y + MOVES_MEASURE },
  };

  const sizeGeneratorByRescaleDirection = {
    in: {
      width: imageRenderDimensions.width * 1.1,
      height: imageRenderDimensions.height * 1.1,
    },
    out: {
      width: imageRenderDimensions.width * 0.9,
      height: imageRenderDimensions.height * 0.9,
    },
  };

  const moveImage = (direction: IMoves) => {
    const canvasComponent = canvasRef.current;
    if (canvasContext && imageObject && canvasComponent) {
      const widthRelation = canvasComponent.width / imageRenderDimensions.width;
      const heightRelation =
        canvasComponent.height / imageRenderDimensions.height;
      if (
        ((direction === "right" || direction === "left") &&
          (canvasComponent.width - Math.abs(imageCoords.x)) /
            imageRenderDimensions.width <
            widthRelation) ||
        ((direction === "up" || direction === "down") &&
          (canvasComponent.height - Math.abs(imageCoords.y)) /
            imageRenderDimensions.height <
            heightRelation)
      ) {
        const newCoords = coordsGeneratorByPosition[direction];
        clearCanvas();
        canvasContext.drawImage(
          imageObject,
          0,
          0,
          imagesDimensions.width,
          imagesDimensions.height,
          newCoords.x,
          newCoords.y,
          imageRenderDimensions.width,
          imageRenderDimensions.height
        );
        setImageCoords(newCoords);
      } else {
        dispatch(
          queueNotification({
            type: "error",
            message: locales.outOfBoundsImageError,
          })
        );
      }
    }
  };

  const resetImage = () => {
    if (canvasContext && imageObject) {
      const width = 500;
      const height = (500 * imagesDimensions.height) / imagesDimensions.width;
      clearCanvas();
      canvasContext.drawImage(
        imageObject,
        0,
        0,
        imagesDimensions.width,
        imagesDimensions.height,
        0,
        0,
        width,
        height
      );
      setImageCoords({ x: 0, y: 0 });
      setImageRenderDimensions({ width, height });
    }
  };

  const rescaleImage = (direction: IRescale) => {
    const canvasComponent = canvasRef.current;
    if (canvasContext && imageObject && canvasComponent) {
      if (
        direction === "out" &&
        canvasComponent.width >
          sizeGeneratorByRescaleDirection[direction].width &&
        canvasComponent.height >
          sizeGeneratorByRescaleDirection[direction].height
      ) {
        resetImage();
        dispatch(
          queueNotification({
            type: "error",
            message: locales.outOfBoundsImageError,
          })
        );
      } else {
        const newWidth = sizeGeneratorByRescaleDirection[direction].width;
        const newHeight = sizeGeneratorByRescaleDirection[direction].height;
        clearCanvas();
        canvasContext.drawImage(
          imageObject,
          0,
          0,
          imagesDimensions.width,
          imagesDimensions.height,
          imageCoords.x,
          imageCoords.y,
          newWidth,
          newHeight
        );
        setImageRenderDimensions({ width: newWidth, height: newHeight });
      }
    }
  };

  const handleImageLoad = (imageFile: File) => {
    if (imageFile) {
      const reader = new FileReader();
      const canvas = canvasRef.current;
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string" && canvas && canvasContext) {
          const img = new Image();
          img.src = result;
          img.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            canvas.width = 500;
            canvas.height = (500 * height) / width;
            canvasContext.drawImage(
              img,
              0,
              0,
              width,
              height,
              0,
              0,
              canvas.width,
              canvas.height
            );
            const dataURL = canvas.toDataURL("image/png");
            setImageObject(img);
            setImageData(dataURL);
            setImageName(imageFile.name);
            setImageCoords({ x: 0, y: 0 });
            setImagesDimensions({ width, height });
            setImageRenderDimensions({
              width: canvas.width,
              height: canvas.height,
            });
            dispatch(
              queueNotification({
                type: "success",
                message: locales.imageLoadedSuccessfully,
              })
            );
          };
        }
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleFile = (imageFile: File) => {
    if (imageFile) {
      const reader = new FileReader();
      const canvasComponent = canvasRef.current;
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string" && canvasContext && canvasComponent) {
          const { canvas } = JSON.parse(result);
          const img = new Image();
          img.src = canvas.photo.data;
          img.onload = () => {
            canvasComponent.width = 500;
            canvasComponent.height =
              (500 * canvas.photo.height) / canvas.photo.width;
            canvasContext.drawImage(
              img,
              0,
              0,
              canvas.photo.width,
              canvas.photo.height,
              canvas.photo.x,
              canvas.photo.y,
              canvas.width,
              canvas.height
            );
            setImageObject(img);
            setImageData(canvas.photo.data);
            setImageName(imageFile.name);
            setImageCoords({ x: canvas.photo.x, y: canvas.photo.y });
            setImagesDimensions({
              width: canvas.photo.width,
              height: canvas.photo.height,
            });
            setImageRenderDimensions({
              width: canvas.width,
              height: canvas.height,
            });
          };
        }
      };
      reader.readAsText(imageFile);
    }
  };

  const clearCanvas = () => {
    if (canvasContext) {
      canvasContext.clearRect(
        0,
        0,
        imageRenderDimensions.width,
        imageRenderDimensions.height
      );
    }
  };

  return {
    canvasRef,
    imageInputRef,
    fileInputRef,
    saveData,
    handleFile,
    handleImageLoad,
    rescaleImage,
    moveImage,
  };
};

export default useHome;
