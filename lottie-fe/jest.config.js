const config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.css$": "<rootDir>/jest/cssTransform.cjs",
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/jest/fileTransform.cjs",
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/shared/view/components/",
    "/src/shared/view/lib/",
  ],
  transformIgnorePatterns: ["/node_modules/(?!lucide-react)"],
  moduleNameMapper: {
    "\\.svg(\\?react)?$": "<rootDir>/jest/svgrMock.js",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/main.tsx",
    "!<rootDir>/src/App.tsx",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/**/*.{types,style}.{ts,tsx}",
    "!<rootDir>/src/pages/*/*.{ts,tsx}",
    "!<rootDir>/src/helpers/{types,tests}/**/*.{ts,tsx}",
  ],
  testEnvironment: "jsdom",
  testTimeout: 10000,
};

export default config;
