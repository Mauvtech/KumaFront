module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: "#607D8B", // Blue Gray
        primaryLight: "rgba(96, 125, 139, 0.1)", // Lightened Blue Gray for background
        secondary: "#80CBC4", // Mint Green
        secondaryLight: "rgba(128, 203, 196, 0.1)", // Lightened Mint Green for background
        accent: "#64D8CB", // Stronger Mint Green
        accentLight: "rgba(100, 216, 203, 0.1)", // Lightened Stronger Mint Green for background
        background: "#FAFAFA", // Very Light Gray
        backgroundHover: "#F0F0F0", // Slightly darker Light Gray for hover
        text: "#37474F", // Dark Gray
        error: "#E57373", // Soft Red
        errorHover: "rgba(229, 115, 115, 0.1)", // Lightened Red for hover
        success: "#81C784", // Soft Green
        successHover: "rgba(129, 199, 132, 0.1)", // Lightened Green for hover
        warning: "#FFB74D", // Soft Orange
        warningHover: "rgba(255, 183, 77, 0.1)", // Lightened Orange for hover
        info: "#64B5F6", // Soft Blue
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Merriweather", "serif"],
        mono: ["Menlo", "monospace"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        neumorphic:
          "2px 2px 5px rgba(0, 0, 0, 0.2), -2px -2px 5px rgba(255, 255, 255, 0.1)",
        "neumorphic-inset":
          "inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.1)",
        "custom-light":
          "0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.5)",
        "custom-dark":
          "10px 10px 20px rgba(0, 0, 0, 0.5), 10px 10px 20px rgba(0, 0, 0, 0.5)",
      },
      zIndex: {
        "-10": "-10",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.text"),
            a: {
              color: theme("colors.primary"),
              "&:hover": {
                color: theme("colors.accent"),
              },
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      textColor: ["visited"],
      display: ["group-hover"],
    },
  },
};
