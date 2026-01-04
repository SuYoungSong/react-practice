import {Button, Dialog, DialogContent, Grid, Typography} from "@mui/material";
import Signup from "./components/Signup.jsx";
import {useState} from "react";

function App() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Grid container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        sx={{width: "400px", height: "400px", margin: "0 auto"}}>
        <Grid>
          <Typography variant="h6" align="center">리액트 연습 프로젝트</Typography>
        </Grid>
        <Grid>
          <Button variant="contained" fullWidth onClick={handleOpen}>회원가입</Button>
        </Grid>
      </Grid>
      {/* Modal Area */}
      <Dialog
        open={open}
        maxWidth={false}
        onClose={(e, reason) => {
          if (reason === 'backdropClick') return;
          handleClose();
        }}
      >
        <DialogContent sx={{padding: 0}}>
          <Signup onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default App
