import MUICard from "@mui/material/Card";
import { CardHeader, CardContent, Typography } from "@mui/material";

const Card = ({ title, children, sx, sxContent, subTitle, headerAction }) => {
  return (
    <MUICard sx={{ borderRadius: 0, ...sx }}>
      {title && (
        <CardHeader
          sx={{
            borderRadius: "0",
            color: "primary.main",
            p: 1,
            borderBottom: "2px solid",
            textAlign: "center",
            boxSizing: "border-box",
          }}
          subheader={subTitle}
          title={
            <Typography variant="h3">
              <strong>{title}</strong>
            </Typography>
          }
          action={headerAction}
        />
      )}
      <CardContent sx={sxContent}>{children}</CardContent>
    </MUICard>
  );
};

export default Card;
