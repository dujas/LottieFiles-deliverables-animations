import React, { useEffect, useMemo, useState } from "react";
import { Configuration } from "@/services/configurationLoader.service";
import BrowserStorage from "@/data-clients/browser-storage";
import { EnvironmentConfigurationLoader } from "@/services/configurationLoader.service";
import { AnimationsUsecase } from "../animations/data/animations.usecase";

type ConfigsType = {
  isOffline: () => boolean;
  configuration: Configuration;
};

const ConfigsContext = React.createContext<ConfigsType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useConfigs = (): ConfigsType => {
  const context = React.useContext(ConfigsContext);
  if (context === undefined) {
    throw new Error("useConfigs can not be used outside ConfigsProvider");
  }
  return context;
};

type ConfigsProviderPropsType = {
  children: React.ReactNode;
};

const isOffline = () => !navigator.onLine;

const useConfiguration = () => {
  const [config, setConfig] = useState<Configuration | null>();

  useEffect(() => {
    const getConfig = async () => {
      let _config: Configuration | null = null;
      if (isOffline()) {
        const browserStorage: BrowserStorage<Configuration | null> =
          BrowserStorage.getInstance();
        _config = browserStorage.get("configuration");
      } else {
        _config = await EnvironmentConfigurationLoader.getConfig();
      }

      // setup s3 client
      const service = new AnimationsUsecase(_config!);
      service.setupS3Client();

      // save config
      setConfig(_config);
    };

    getConfig();
  }, []);

  return config;
};

// eslint-disable-next-line complexity
const ConfigsProvider = ({
  children,
}: ConfigsProviderPropsType): JSX.Element => {
  const configuration = useConfiguration();

  const configs = useMemo(
    () => ({
      configuration,
      isOffline,
    }),
    [configuration],
  ) as ConfigsType;

  if (!configuration) {
    return <div>Error loading configuration</div>;
  }
  return (
    <ConfigsContext.Provider value={configs}>
      {children}
    </ConfigsContext.Provider>
  );
};

export default ConfigsProvider;
