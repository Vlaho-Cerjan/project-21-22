import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import React from 'react';
import {expect, vi} from 'vitest';
import AutoCompleteInput from './autocompleteInput';

let getPlaceReturnValue = {};

vi.stubGlobal('google', {
  maps: {
    places: {
      Autocomplete: vi.fn().mockImplementation(() => ({
        addListener: vi.fn((event, callback) => {
          if (event === 'place_changed') {
            callback();
          }
        }),
        getPlace: vi.fn(() => getPlaceReturnValue),
      })),
    },
  },
});

const {useScriptMock} = vi.hoisted(() => {
  return {useScriptMock: vi.fn()};
});

vi.mock('usehooks-ts', () => ({
  useScript: useScriptMock,
}));

describe('AutoCompleteInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useScriptMock.mockReturnValue('ready');
    getPlaceReturnValue = {address_components: []};
  });

  afterEach(() => {
    getPlaceReturnValue = {};
  });

  it('renders children properly', () => {
    renderWithProviders(
      <AutoCompleteInput inputRef={React.createRef()} onChange={vi.fn()}>
        <div>Test Child</div>
      </AutoCompleteInput>,
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('initializes Autocomplete when script is loaded and input ref is provided', () => {
    const inputRef = React.createRef<HTMLInputElement>();
    const onChangeMock = vi.fn();

    renderWithProviders(
      <AutoCompleteInput inputRef={inputRef} onChange={onChangeMock}>
        <input ref={inputRef} onChange={onChangeMock} data-testid="input" />
      </AutoCompleteInput>,
    );

    const input = screen.getByTestId('input');
    fireEvent.change(input, {target: {value: 'test'}});

    expect(global.google.maps.places.Autocomplete).toHaveBeenCalledWith(
      inputRef.current,
      expect.any(Object),
    );
  });

  it('calls onChange with place when a place is selected', () => {
    const onChangeMock = vi.fn();
    const inputRef = React.createRef<HTMLInputElement>();

    renderWithProviders(
      <AutoCompleteInput inputRef={inputRef} onChange={onChangeMock}>
        <input ref={inputRef} onChange={onChangeMock} data-testid="input" />
      </AutoCompleteInput>,
    );

    expect(onChangeMock).toHaveBeenCalledWith({address_components: []});
  });

  it('does not initialize Autocomplete when script is loading', () => {
    const inputRef = React.createRef<HTMLInputElement>();
    useScriptMock.mockReturnValue('loading');
    const onChangeMock = vi.fn();
    renderWithProviders(
      <AutoCompleteInput inputRef={inputRef} onChange={onChangeMock}>
        <input ref={inputRef} onChange={onChangeMock} data-testid="input" />
      </AutoCompleteInput>,
    );

    expect(global.google.maps.places.Autocomplete).not.toHaveBeenCalled();
  });
  it('does not initialize Autocomplete without an inputRef', () => {
    renderWithProviders(
      <AutoCompleteInput
        inputRef={{
          current: null,
        }}
        onChange={vi.fn()}
      >
        <div>Test Child</div>
      </AutoCompleteInput>,
    );

    expect(global.google.maps.places.Autocomplete).not.toHaveBeenCalled();
  });

  it('does not initialize Autocomplete because useScript returns error', () => {
    const inputRef = React.createRef<HTMLInputElement>();
    useScriptMock.mockReturnValue('error');
    const onChangeMock = vi.fn();
    renderWithProviders(
      <AutoCompleteInput inputRef={inputRef} onChange={onChangeMock}>
        <input ref={inputRef} onChange={onChangeMock} data-testid="input" />
      </AutoCompleteInput>,
    );

    expect(global.google.maps.places.Autocomplete).not.toHaveBeenCalled();
  });

  it('calls onChange with the place when place changes', () => {
    const onChangeMock = vi.fn();
    const inputRef = {current: document.createElement('input')};

    renderWithProviders(
      <AutoCompleteInput inputRef={inputRef} onChange={onChangeMock}>
        <input />
      </AutoCompleteInput>,
    );

    expect(onChangeMock).toHaveBeenCalled();
    expect(onChangeMock).toHaveBeenCalledWith({
      address_components: [],
    });
  });

  it('does not call onChange if place has no address components', () => {
    // Adjust the behavior for this specific test
    getPlaceReturnValue = {};

    const onChangeMock = vi.fn();
    const inputRef = {current: document.createElement('input')};

    renderWithProviders(
      <AutoCompleteInput inputRef={inputRef} onChange={onChangeMock}>
        <div />
      </AutoCompleteInput>,
    );

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('does not load the script if active is false', () => {
    renderWithProviders(
      <AutoCompleteInput
        inputRef={React.createRef()}
        onChange={vi.fn()}
        active={false}
      >
        <div />
      </AutoCompleteInput>,
    );

    expect(useScriptMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({shouldPreventLoad: true}),
    );
  });
});
