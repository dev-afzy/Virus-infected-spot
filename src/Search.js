import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

export default function Search({ panTo }) {
  const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
    requestOptions: {
      location: {
        lat: () => 25.2048,
        lng: () => 55.2708
      },
      radius: 100 * 1000
    }
  });

  const onSelect = async (address) => {
    try {
      const results = await getGeocode({ address })
      const { lat, lng } = await getLatLng(results[0])
      setValue(address, false);
      clearSuggestions();
      panTo({ lat, lng })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="search">
      <Combobox onSelect={onSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder="Search place" />
        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' && data.map(({ description, place_id }) => <ComboboxOption key={place_id}
              value={description} />)}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}