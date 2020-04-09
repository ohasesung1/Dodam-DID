exports.notice = (() => {
  let instance;

  return {
    setInstance: (ws) => {
      instance = ws;
    },
    getInstance: () => instance,
  };
})();
