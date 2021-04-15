import { AppBar, Toolbar, Typography } from "@material-ui/core";

function Navbar() {
  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h5'>Practice Booking</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
