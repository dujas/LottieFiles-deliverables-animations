// Since we are using svgr and utilizing it to get React components with "?react",
// this wont be used for jest tests, thus we need to mock ?react calls to return react mocked component
import React from 'react';
export default 'SvgMock';
export const ReactComponent = () => <svg />; // Export a mock component if you need a component.
