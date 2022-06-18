import {
  Button,
  Card,
  FileInput,
  Spacer,
  ViewHeader,
  ViewLayout,
} from "../../components/commons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";

const locales = {
  tile: "Photo editor",
  saveBtnLabel: "Save file",
  imagePlaceholder: "Image will be rendered here",
};

type IMoves = "right" | "left" | "up" | "down";

type IRescale = "in" | "out";

function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageObject, setImageObject] = useState<CanvasImageSource>();
  const [imageData, setImageData] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageCoords, setImageCoords] = useState({ x: 0, y: 0 });
  const [imagesDimensions, setImagesDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>();

  const loadImageIntoCanvas = () => {
    if (canvasContext && imageData) {
      const img = new Image();
      img.onload = function () {
        canvasContext.drawImage(img, 0, 0);
      };
      img.src = imageData;
    }
  };

  const coordsGeneratorByPosition = {
    left: { x: imageCoords.x - 5, y: imageCoords.y },
    right: { x: imageCoords.x + 5, y: imageCoords.y },
    up: { x: imageCoords.x, y: imageCoords.y - 5 },
    down: { x: imageCoords.x, y: imageCoords.y + 5 },
  };

  const sizeGeneratorByRescaleDirection = {
    in: {
      width: canvasDimensions.width * 1.1,
      height: canvasDimensions.height * 1.1,
    },
    out: {
      width: canvasDimensions.width * 0.9,
      height: canvasDimensions.height * 0.9,
    },
  };

  const moveImage = (direction: IMoves) => {
    if (canvasContext && imageObject) {
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
        canvasDimensions.width,
        canvasDimensions.height
      );
      setImageCoords(newCoords);
    }
  };

  const rescaleImage = (direction: IRescale) => {
    if (canvasContext && imageObject) {
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
      setCanvasDimensions({ width: newWidth, height: newHeight });
    }
  };

  const handleImage = (imageFile: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      if (typeof reader.result === "string") {
        img.src = reader.result;
      }
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext("2d");
          if (context) {
            canvas.width = 500;
            canvas.height = (500 * height) / width;
            context.drawImage(
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
            setCanvasContext(context);
            setImageData(dataURL);
            setImageName(imageFile.name);
            setImageCoords({ x: 0, y: 0 });
            setImagesDimensions({ width, height });
            setCanvasDimensions({ width: canvas.width, height: canvas.height });
          }
        }
      };
    };
    reader.readAsDataURL(imageFile);
  };

  const resetInput = () => {
    const input = inputRef.current;
    if (input) {
      input.value = "";
    }
  };

  const clearCanvas = () => {
    if (canvasContext) {
      canvasContext.clearRect(
        0,
        0,
        canvasDimensions.width,
        canvasDimensions.height
      );
    }
  };

  const saveData = () => {
    const object = {
      canvas: {
        width: canvasDimensions.width,
        height: canvasDimensions.height,
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

  return (
    <ViewLayout>
      <Card>
        <ViewHeader
          title={locales.tile}
          icon={<FontAwesomeIcon icon={faImage} />}
        >
          <Button
            label={locales.saveBtnLabel}
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
            onClick={loadImageIntoCanvas}
          />
        </ViewHeader>
        <Spacer spacing={1} />
        <button
          onClick={() => {
            resetInput();
            clearCanvas();
          }}
        >
          Clear input and canvas
        </button>
        <Spacer spacing={1} />
        <div style={{ display: "flex" }}>
          <button onClick={() => moveImage("left")}>left</button>
          <button onClick={() => moveImage("up")}>up</button>
          <button onClick={() => moveImage("down")}>down</button>
          <button onClick={() => moveImage("right")}>right</button>
        </div>
        <Spacer spacing={1} />
        <div style={{ display: "flex" }}>
          <button onClick={() => rescaleImage("in")}>zoom in</button>
          <button onClick={() => rescaleImage("out")}>zoom out</button>
        </div>
        <Spacer spacing={1} />
        <div style={{ display: "flex" }}>
          <button onClick={() => saveData()}>Download file</button>
        </div>
        <Spacer spacing={1} />
        <label htmlFor="file-input" style={{ marginBottom: 4 }}>
          Select a file:
        </label>
        <FileInput
          id="file-input"
          ref={inputRef}
          onChange={(val) => val && handleImage(val[0])}
        />
        <Spacer spacing={1} />
        <canvas ref={canvasRef} />
      </Card>
    </ViewLayout>
  );
}

export default Home;
