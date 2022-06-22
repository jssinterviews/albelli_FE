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
import useHome from "./useHome";

const locales = {
  tile: "Photo editor",
  saveBtnLabel: "Save file",
  loadImageLabel: "Upload an image to edit:",
  loadFileLabel: "Upload a previous saved file:",
};

function Home() {
  const {
    imageInputRef,
    canvasRef,
    fileInputRef,
    saveData,
    handleImageLoad,
    handleFile,
    rescaleImage,
    moveImage,
  } = useHome();

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
            onClick={saveData}
          />
        </ViewHeader>
        <Spacer spacing={1} />
        <label htmlFor="image-input" style={{ marginBottom: 4 }}>
          {locales.loadImageLabel}
        </label>
        <FileInput
          id="image-input"
          ref={imageInputRef}
          onChange={(val) => val && handleImageLoad(val[0])}
        />
        <Spacer spacing={1} />
        <label htmlFor="file-input" style={{ marginBottom: 4 }}>
          {locales.loadFileLabel}
        </label>
        <FileInput
          id="file-input"
          accept=".txt"
          ref={fileInputRef}
          onChange={(val) => val && handleFile(val[0])}
        />
        <Spacer spacing={1} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={() => rescaleImage("in")} label="Zoom in" />
          <Button onClick={() => rescaleImage("out")} label="Zoom out" />
        </div>
        <Spacer spacing={1} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button onClick={() => moveImage("up")} label="Up" />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={() => moveImage("left")} label="Left" />
            <canvas ref={canvasRef} />
            <Button onClick={() => moveImage("right")} label="Right" />
          </div>
          <Button onClick={() => moveImage("down")} label="Down" />
        </div>
      </Card>
    </ViewLayout>
  );
}

export default Home;
