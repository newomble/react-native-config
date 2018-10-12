using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace React.Native.Config.ReactNativeConfig
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class ReactNativeConfigModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="ReactNativeConfigModule"/>.
        /// </summary>
        internal ReactNativeConfigModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "ReactNativeConfig";
            }
        }
        
        public override IReadOnlyDictionary<string, object> Constants
        {
            get
            {
                return (new GeneratedDotEnv()).EnvConstants;
            }
        }
    }
}
