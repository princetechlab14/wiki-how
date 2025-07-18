setTimeout(function () {
    !(function (_window, _document) {
        var OB_ADV_ID = "00f8d7a2dcd85d3cd2596e95609403e8fd";
        if (_window.obApi) {
            var toArray = function (object) {
                return Object.prototype.toString.call(object) === "[object Array]"
                    ? object
                    : [object];
            };
            _window.obApi.marketerId = toArray(_window.obApi.marketerId).concat(
                toArray(OB_ADV_ID)
            );
            return;
        }
        var api = (_window.obApi = function () {
            api.dispatch
                ? api.dispatch.apply(api, arguments)
                : api.queue.push(arguments);
        });
        api.version = "1.1";
        api.loaded = true;
        api.marketerId = OB_ADV_ID;
        api.queue = [];
        var tag = _document.createElement("script");
        tag.async = true;
        tag.src = "//amplify.outbrain.com/cp/obtp.js";
        tag.type = "text/javascript";
        var script = _document.getElementsByTagName("script")[0];
        script.parentNode.insertBefore(tag, script);
    })(window, document);

    obApi("track", "PV60");
}, 5000);
