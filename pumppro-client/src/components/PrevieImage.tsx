import { Box } from "@mui/material";
import { red } from "@mui/material/colors";

interface PreviewImageProps {
  imageFile: File;
  handleDeleteImage: () => void;
}

export const PreviewImage = ({
  imageFile,
  handleDeleteImage,
}: PreviewImageProps) => {
  const objectURL = URL.createObjectURL(imageFile);

  return (
    <Box sx={{ position: "relative", cursor: "pointer" }}>
      <Box
        component="img"
        className="rounded-xl object-cover"
        src={objectURL}
        alt={imageFile.name}
      />
      <Box
        sx={{
          position: "absolute",
          top: 2,
          right: 2,
          backgroundColor: red[100],
          color: red[500],
          width: "3rem",
          height: "3rem",
          p: "0.5rem",
          borderRadius: "50%",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          onClick={() => handleDeleteImage()}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </Box>
    </Box>
  );
};
