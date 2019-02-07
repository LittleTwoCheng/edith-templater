import red from "@material-ui/core/colors/red";
import grey from "@material-ui/core/colors/grey";

export default {
    palette: {
        primary: {
            main: "#00a446"
        },
        secondary: { main: "#f8a200" },
        brand: {
            green: "#00a446",
            orange: "#f8a200",
            red: red[600],
            blue: "#00b6ff",
            white: "#fdfdfd",
            gray: grey[500],
            black: grey[800]
        }
    },
    typography: {
        useNextVariants: true
    }
};
