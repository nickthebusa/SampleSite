import { render } from '@testing-library/react';
import FlippingText from './FlippingText';

describe('Test for Flipping Text component', () => {
  test('test render', () => {
    const { getByTestId } = render(<FlippingText />)
    expect(getByTestId('content')).toBeInTheDocument()
  })
})
