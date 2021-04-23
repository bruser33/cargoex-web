/* global google */

import React from "react";
class Autocompleteg extends React.Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
  }

  componentDidMount() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.current,
      { types: ["geocode"] }
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceChanged);
  }

  handlePlaceChanged() {
    const place = this.autocomplete.getPlace();
    this.props.onPlaceChanged(place);
  }

  render() {
    return (
      <input
        ref={this.autocompleteInput}
        style={{width:'100%'}}
        id="autocomplete"
        placeholder="Entra tu direccion"
        type="text"
      />
    );
  }
}

export default Autocompleteg;
