import React from "react";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./styles.css";

export default function App() {
  const [items, setItems] = React.useState(getLocalItems());
  const theDate = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  React.useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  function getLocalItems() {
    const localItems = JSON.parse(localStorage.getItem("items"));
    return localItems || [];
  }

  // source: egghead.io Beginners Guide to React course
  // https://github.com/kentcdodds/beginners-guide-to-react/blob/egghead/23-rendering-lists.html
  function shuffle(originalArray) {
    const array = [...originalArray];
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  function handleShuffle() {
    setItems(shuffle(items));
  }

  return (
    <div className="App">
      <Typography variant="h3" className="heading">
        Welcome to Standup
      </Typography>
      <Typography variant="subtitle1" className="heading">
        {theDate}
      </Typography>
      <ParticipantsAccordian onGenerateList={setItems} />
      <div className="items-container">
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleShuffle}
        >
          Shuffle
        </Button>
        <ValuesList items={items} />
      </div>
    </div>
  );
}

function ParticipantsAccordian({ onGenerateList }) {
  const [itemsText, setItemsText] = React.useState(getLocalItemsText());

  React.useEffect(() => {
    localStorage.setItem("itemsText", itemsText);
  }, [itemsText]);

  function getLocalItemsText() {
    const localItems = localStorage.getItem("itemsText");
    return localItems || "";
  }

  function handleItemsTextChange(event) {
    event.preventDefault();
    setItemsText(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const rawValues = event.target.elements.valuesInput.value;
    const itemsAry = rawValues
      ? rawValues
          .trim()
          .split("\n")
          .filter((e) => e)
      : [];
    onGenerateList(itemsAry.sort());
    setItemsText(rawValues);
  }

  function handleReset() {
    const prompt =
      "This will clear out your form and delete your locally saved data. " +
      "You will have to re-enter all the participant names. Are you sure?";
    if (window.confirm(prompt)) {
      document.getElementById("standupForm").reset();
      onGenerateList([]);
      setItemsText("");
    }
  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="participants-content"
        id="participants-header"
      >
        <Typography variant="subtitle1">Participants</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* <Typography variant="body2">
          Participants
        </Typography> */}

        <form id="standupForm" onSubmit={handleSubmit}>
          {/* <label htmlFor="valuesInput">
        Enter participant names, one per line:
      </label> */}
          <div>
            <TextField
              id="valuesInput"
              placeholder="Enter participant names, one per line"
              helperText="Will be saved in your browser's local storage, so you'll have it the next time you visit this page"
              value={itemsText}
              onChange={handleItemsTextChange}
              minRows={5}
              variant="outlined"
              multiline
              size="small"
            />
          </div>
          <div className="items-container">
            <Button type="submit" variant="contained">
              Generate List
            </Button>{" "}
            <Button type="button" variant="outlined" onClick={handleReset}>
              Clear
            </Button>
          </div>
        </form>
      </AccordionDetails>
    </Accordion>
  );
}

function ValuesList({ items }) {
  return (
    <div className="items-list">
      <div className="item-name">
        <Typography variant="subtitle2">Name</Typography>
      </div>
      <div>
        <Typography variant="subtitle2">Notes</Typography>
      </div>
      <FormGroup>
        {items.map((item) => (
          <div key={item} className="item-row">
            <div className="item-name">
              <FormControlLabel control={<Checkbox />} label={item} />
            </div>
            <TextField variant="outlined" size="small" fullWidth />
          </div>
        ))}
      </FormGroup>
    </div>
  );
}
