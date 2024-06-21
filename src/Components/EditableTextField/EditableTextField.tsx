import React, { useEffect, useState, useRef } from "react";
import {
  Stack,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Button,
  Fade,
  Paper,
  Box,
  TypographyProps
} from "@mui/material";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

interface Props {
  variant: TypographyProps["variant"];
  value?: string | null;
  fallback?: string;
  onChange?: (value: string | undefined | null) => Promise<void>;
  isRequired?: boolean;
  storageKey: string;  // Add a key for storing the value in localStorage
}

export const EditableTextField = (props: Props) => {
  const { variant, value, fallback, onChange, isRequired = true, storageKey } = props;
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string | null>(() => {
    return localStorage.getItem(storageKey) || value || '';
  });
  const [submitting, setSubmitting] = useState(false);
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedValue = localStorage.getItem(storageKey);
    setInputValue(storedValue !== null ? storedValue : (value || ''));
  }, [value, storageKey]);


  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, [editing]);

  const handleSubmit = async () => {
    if (inputValue?.trim()) {
      setSubmitting(true);
      localStorage.setItem(storageKey, inputValue);
      if (onChange) {
        await onChange(inputValue);
      }
      setSubmitting(false);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    const storedValue = localStorage.getItem(storageKey);
    setInputValue(storedValue !== null ? storedValue : (value || ''));
    setEditing(false);
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\n$/, "");  // Remove line breaks from end of the value
    setInputValue(value);
  };

  const handleHover = (event: "enter" | "leave") => {
    setHover(event === "enter");
  };

  const showEmptyFieldWarning = isRequired && !inputValue?.trim() && editing;

  return (
    <Stack direction="row" sx={{paddingTop: "20px"}}>
      <Stack
        border={
          showEmptyFieldWarning
            ? "0.1em solid red"
            : editing
              ? "0.1em solid black"
              : "none"
        }
        borderRadius="2em"
        marginBottom={"1em"}
      >
        <Paper
          elevation={showEmptyFieldWarning ? 0 : editing ? 4 : 0}
          sx={{ borderRadius: "2em" }}
        >
          <Stack
            padding={"0.3em"}
            paddingRight={editing ? "0.3em" : "1em"}
            direction="row"
            onMouseEnter={() => handleHover("enter")}
            onMouseLeave={() => handleHover("leave")}
            borderRadius="2em"
            paddingLeft="1em"
            bgcolor={hover && !editing ? "lightgray" : "primary"}
            spacing={2}
            alignItems="center"
            sx={{
              transition: "background-color 0.2s",
              "& > :not(style) ~ :not(style)": { marginLeft: 0 },
            }}
          >
            {!editing && (
              <>
                <Typography variant={variant} minHeight="2rem" sx={{ wordWrap: "break-word" }}>
                  {inputValue && inputValue !== "" ? inputValue : fallback}
                </Typography>
                {!hover && <Box width="2em" />}
                {hover && (
                  <Box width="2em">
                    <IconButton sx={{ maxHeight: "2rem", ml: "0.5rem" }} onClick={() => setEditing(true)}>
                      <CreateOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </>
            )}
            {editing && (
              <>
                <TextField
                  fullWidth
                  variant="standard"
                  hiddenLabel
                  value={inputValue}
                  onChange={handleOnChange}
                  onKeyDown={handleKeyDown}
                  InputProps={{ disableUnderline: true }}
                  inputRef={inputRef}
                />
                <Box>
                  <Button sx={{borderRadius: "20px"}} onClick={handleCancel} variant="outlined" color="inherit">
                    Cancel
                  </Button>
                </Box>
                <Box sx={{ paddingLeft: "0.3em" }}>
                  <Button
                    sx={{borderRadius: "20px"}}
                    disableElevation={true}
                    onClick={handleSubmit}
                    disabled={submitting || !inputValue?.trim()} // Disable when submitting or inputValue is empty/whitespace
                    variant="contained"
                  >
                    Save
                    {submitting ? (
                      <CircularProgress size={22} />
                    ) : (
                      <SaveOutlinedIcon sx={{ ml: "0.2em" }} />
                    )}
                  </Button>
                </Box>
              </>
            )}
          </Stack>
        </Paper>
      </Stack>
      {showEmptyFieldWarning && isRequired && (
        <Fade in={showEmptyFieldWarning}>
          <Stack
            sx={{
              bgcolor: "black",
              borderRadius: "0.4em",
              p: 1,
              m: "0.2em",
              justifyContent: "center",
              height: "3em"
            }}
          >
            <Typography style={{ color: "white", fontSize: "0.7em" }}>
              This field cannot be empty
            </Typography>
          </Stack>
        </Fade>
      )}
    </Stack>
  );
};
