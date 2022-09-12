import React from 'react';
import FavoritesPage from '../screens/FavoritesPage';
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

describe('<FavoritesPage />', () => {
  beforeEach(() => {
    mockedDispatch.mockClear();
  });

  it('renders correctly', () => {
    const mockedParams = {
      route: {
        params: {}
      },
      navigation: {
        setOptions: jest.fn()
      },
    };

    const tree = renderer.create(<FavoritesPage {...mockedParams} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
