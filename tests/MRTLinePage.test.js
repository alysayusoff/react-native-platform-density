import React from 'react';
import MRTLinePage from '../screens/MRTLinePage';
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

describe('<MRTLinePage />', () => {
  beforeEach(() => {
    mockedDispatch.mockClear();
  });

  it('renders correctly', () => {
    const mockedParams = {
      route: {
        params: {
          data: {}
        }
      },
      navigation: {
        setOptions: jest.fn()
      },
    };

    const tree = renderer.create(<MRTLinePage {...mockedParams} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
