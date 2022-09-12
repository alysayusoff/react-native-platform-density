import React from 'react';
import SearchResultsPage from '../screens/SearchResultsPage';
import renderer from 'react-test-renderer';

const mockedDispatch = jest.fn();
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: mockedDispatch,
    }),
  };
});

describe('<SearchResultsPage />', () => {
  beforeEach(() => {
    mockedDispatch.mockClear();
  });

  it('renders correctly', () => {
    const mockedParams = {
      route: {
        params: {
          input: "input"
        }
      },
      navigation: {
        setOptions: jest.fn(),
        toUpperCase: jest.fn()
      },
    };

    const tree = renderer.create(<SearchResultsPage {...mockedParams} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
