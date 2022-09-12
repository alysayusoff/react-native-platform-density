import React from 'react';
import MapPage from '../screens/MapPage';
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

describe('<MapPage />', () => {
  beforeEach(() => {
    mockedDispatch.mockClear();
  });

  it('renders correctly', () => {
    const mockedParams = {
      route: {
        params: {}
      }
    };

    const tree = renderer.create(<MapPage {...mockedParams} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
