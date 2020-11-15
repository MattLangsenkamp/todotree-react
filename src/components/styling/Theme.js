import { createMuiTheme } from "@material-ui/core/styles";

const earthGreen = "#3c9d76";
const nuetralGray = "#dddddd";

export default createMuiTheme({
  palette: {
    common: {
      green: earthGreen,
      gray: nuetralGray,
    },
    primary: {
      main: earthGreen,
    },
    secondary: {
      main: nuetralGray,
    },
  },
});
