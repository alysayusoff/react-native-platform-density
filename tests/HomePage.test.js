import React from 'react';
import HomePage from '../screens/HomePage';
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

describe('<HomePage />', () => {
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

    const tree = renderer.create(<HomePage {...mockedParams} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
