import { Stack, CssBaseline } from "@mui/material";
import { AppHeader } from "./Components/Header/AppHeader";
import { EditableTextField } from "./Components/EditableTextField/EditableTextField";

function App() {

  return (
    <Stack>
      <CssBaseline />
      <AppHeader />
      <Stack>
        <EditableTextField variant="h2" storageKey="mainBudget"/>
      </Stack>
    </Stack>
  )
}

export default App
