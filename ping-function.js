function ping(ip, callback) {

    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        var _that = this;
        this.img = new Image();
        this.img.onload = function () {
            _that.inUse = false;
            _that.callback('responded');

        };
        this.img.onerror = function (e) {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('responded', e);
            }

        };
        this.start = new Date().getTime();
        this.img.src = "http://" + ip;
        this.timer = setTimeout(function () {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('timeout');
            }
        }, 1500);
    }
}
var json = {
  services: [
    {
      "name": "Website",
      "description": "Our main website",
      "url": "ndx.xyz"
    },
    {
      "name": "Dexter",
      "description": "The official NDX Community Discord bot",
      "url": "ndx.xyz"
    }
    {
      "name": "Minecraft Server",
      "description": "Our semi-public Minecraft server",
      "url": "play.ndx.xyz"
    }
    {
      "name": "Rust Server",
      "description": "Our public Rust server",
      "url": "ndx.xyz:28015"
    }
  }]
}
var PingModel = function (servers) {
    var self = this;
    var myServers = [];
    ko.utils.arrayForEach(servers, function (location) {
        myServers.push({
            name: location,
            status: ko.observable('unchecked')
        });
    });
    self.servers = ko.observableArray(myServers);
    ko.utils.arrayForEach(self.servers(), function (s) {
        s.status('checking');
        new ping(s.name, function (status, e) {
            s.status(status);
        });
    });
};
var komodel = new PingModel(['localhost',
    'google.fr',
    'play.ndx.xyz',
    'ndx.xyz',
    'ndx.xyz:28015'
    ]);
ko.applyBindings(komodel);
