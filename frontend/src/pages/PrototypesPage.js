import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import PrototypeCard from "../components/PrototypeCard";

const useStyles = makeStyles({
  root: {
    marginTop: 20,
  },
  loader: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    marginBottom: "1rem",
    padding: "13px",
  },
  filters: {
    padding: "0 1.5rem",
  },
  priceRangeInputs: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const PrototypesPage = () => {
  // Material UI Styles
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [slidreMin, setSlideMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(1000);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [priceOrder, setPriceOrder] = useState("descending");

  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = useState("");

  const upateUIValues = (uiValues) => {
    // setSliderMin(uiValues.minPrice);
    setSliderMax(uiValues.maxPrice);

    if (uiValues.filtering.price) {
      let priceFilter = uiValues.filtering.price;

      setPriceRange([Number(priceFilter.gte), Number(priceFilter.lte)]);
    }

    if (uiValues.sorting.price) {
      let priceSort = uiValues.sorting.price;
      setPriceOrder(priceSort);
    }
  };

  const params = location.search ? location.search : null;

  //component state
  const [prototypes, setPrototypes] = useState([]);
  const [filteredPrototypes, setFilteredPrototypes] = useState([]);
  const [loading, setLoading] = useState(false);

  //side effects
  useEffect(() => {
    let cancel;
    const fetchData = async () => {
      setLoading(true);

      try {
        let query;

        if (params && !filter) {
          query = params;
        } else {
          query = filter;
        }

        if (sorting) {
          if (query.length === 0) {
            query = `?sort=${sorting}`;
          } else {
            query = query + "&sort=" + sorting;
          }
        }

        const { data } = await axios({
          method: "GET",
          url: `/api/v1/prototype` + query,
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });
        setPrototypes(data.data);
        setLoading(false);
        upateUIValues({
          ...data.uiValues,
          maxPrice: parseInt(data.uiValues.maxPrice),
          minPrice: parseInt(data.uiValues.minPrice),
        });
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.log(error);
      }
    };
    fetchData();
    return () => cancel();
  }, [filter, params, sorting]);

  const handlePriceInputChange = (e, type) => {
    let newRange;

    if (type === "lower") {
      newRange = [...priceRange];
      newRange[0] = Number(e.target.value);

      setPriceRange(newRange);
    }

    if (type === "upper") {
      newRange = [...priceRange];
      newRange[1] = Number(e.target.value);

      setPriceRange(newRange);
    }
  };

  const onSliderCommitHandler = (e, newValue) => {
    buildRangeFilter(newValue);
  };

  const onTextfieldCommitHandler = () => {
    buildRangeFilter(priceRange);
  };

  const buildRangeFilter = (newValue) => {
    const urlFilter = `?price[gte]=${newValue[0]}&price[lte]=${newValue[1]}`;

    setFilter(urlFilter);

    history.push(urlFilter);
  };

  const handleSortChange = (e) => {
    setPriceOrder(e.target.value);

    if (e.target.value === "ascending") {
      setSorting("price");
    } else if (e.target.value === "descending") {
      setSorting("-price");
    }
  };

  const clearAllFilters = () => {
    setFilter("");
    setSorting("");
    setPriceRange([0, sliderMax]);
    history.push("/");
  };

  return (
    <Container className={classes.root}>
      {/* Filtering and sorting */}
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Filters</Typography>

            <div className={classes.filters}>
              <Slider
                min={0}
                max={sliderMax}
                value={priceRange}
                valueLabelDisplay='auto'
                disabled={loading}
                onChange={(e, newValue) => setPriceRange(newValue)}
                onChangeCommitted={onSliderCommitHandler}
              />

              <div className={classes.priceRangeInputs}>
                <TextField
                  size='small'
                  id='lower'
                  label='Min Price'
                  variant='outlined'
                  type='number'
                  disabled={loading}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceInputChange(e, "lower")}
                  onBlur={onTextfieldCommitHandler}
                />

                <TextField
                  size='small'
                  id='upper'
                  label='Max Price'
                  variant='outlined'
                  type='number'
                  disabled={loading}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceInputChange(e, "upper")}
                  onBlur={onTextfieldCommitHandler}
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Sort By</Typography>

            <FormControl component='fieldset' className={classes.filters}>
              <RadioGroup
                aria-label='price-order'
                name='price-order'
                value={priceOrder}
                onChange={handleSortChange}
              >
                <FormControlLabel
                  value='descending'
                  disabled={loading}
                  control={<Radio />}
                  label='Price: Highest - Lowest'
                />

                <FormControlLabel
                  value='ascending'
                  disabled={loading}
                  control={<Radio />}
                  label='Price: Lowest - Highest'
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Button size='small' color='primary' onClick={clearAllFilters}>
          Clear All
        </Button>
      </Paper>

      {/* Practices Listing */}
      <Grid container spacing={2}>
        {loading ? (
          <div className={classes.loader}>
            <CircularProgress size='3rem thickness={5}' />
          </div>
        ) : (
          prototypes.map((prototype) => (
            <Grid item key={prototype._id} xs={12} sm={6} md={4} lg={3}>
              <PrototypeCard prototype={prototype} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default PrototypesPage;
