import React from 'react';
import CardView from '../components/CardView';
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

describe('<CardView />', () => {
  beforeEach(() => {
    mockedDispatch.mockClear();
  });

  it('renders correctly', () => {
    const mockedParams = {
      route: {
        params: {}
      }
    };

    const tree = renderer.create(<CardView {...mockedParams} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
