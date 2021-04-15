import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@material-ui/core";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const PrototypeCard = ({ prototype }) => {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar />}
        title={<Typography variant='h6'>{prototype.name}</Typography>}
      />

      <CardContent>
        <Typography variant='caption'>{prototype.description}</Typography>

        <Typography variant='h6' gutterBottom>
          {formatter.format(prototype.price)}
        </Typography>
      </CardContent>

      <CardActions>
        <Button variant='contained' size='small' color='primary'>
          Book Now
        </Button>
        <Button size='small' color='primary'>
          Learn more
        </Button>
      </CardActions>
    </Card>
  );
};

export default PrototypeCard;
