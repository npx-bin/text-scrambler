/**
 * Text Scrambler : An isomorphic text scrambling utility for both Browser & NodeJS environments.
 *
 * Author: kcak11 (https://kcak11.com)
 * License: MIT (https://mit-license.kcak11.com)
 */

/**
 * Type: constructor
 * @data [MANDATORY: The data for initializing the PipedData
 */
(typeof window !== "undefined"
  ? window
  : typeof global !== "undefined"
  ? global
  : {}
).PipedData = function (data) {
  this.data = data;
  (function (proto) {
    /**
     * @returns: The raw data without any encoding.
     */
    proto.raw =
      proto.raw ||
      function () {
        return this.data;
      };
    /**
     * @returns: The urlencoded data.
     */
    proto.encode =
      proto.encode ||
      function () {
        return encodeURIComponent(this.data);
      };
    /**
     * @returns: The base64encoded data.
     */
    proto.base64encode =
      proto.base64encode ||
      function () {
        if (typeof btoa !== "undefined") {
          return btoa(this.encode());
        } else {
          return Buffer.from(this.encode()).toString("base64");
        }
      };
    proto.toString = function () {
      return "[PipedData]";
    };
  })(PipedData.prototype);
};

/**
 * @data [MANDATORY]: The urlencoded string.
 * @returns: The urldecoded string.
 */
PipedData.decode = function (data) {
  return decodeURIComponent(data);
};

/**
 * @data [MANDATORY]: The base64 encoded string.
 * @returns: the base64 decoded string.
 */
PipedData.base64decode = function (data) {
  if (typeof atob !== "undefined") {
    return decodeURIComponent(atob(data));
  } else {
    return decodeURIComponent(Buffer.from(data, "base64").toString("ascii"));
  }
};

/**
 * @globalObject [MANDATORY]: The globalObject represents the following:
 * 'window' object when running in the scope of a Browser.
 * 'global' object when running in the scope of NodeJS.
 * If both the window & global objects are not available, then the globalObject will be defaulted to an empty object {}
 */
(function (globalObject) {
  /**
   * @msg [MANDATORY]: The message string that needs to be scrambled/unscrambled
   * @key [MANDATORY]: The key to be used for scrambling/unscrambling the message
   *
   * @returns: The scrambled/unscrambled message text.
   */
  globalObject.scramble = function (msg, key) {
    if (!msg || !key || typeof msg !== "string" || typeof key !== "string") {
      throw new this.Error(
        "msg & key are mandatory parameters of type <string>."
      );
    }
    var SECRETS = [
      "ZJmFM7QHeT3AWc94C2tGf0dqoESKgwlV",
      "DfxBlP30taR594ZAFioLwNvIzbeQnXOm",
      "Y4ogmFEnhD7y1W5J6srUkzVuLStfwGvC",
      "jcGNLRsirXpMbJZOadmEFHeY3Q2tTkqw",
      "dpwaAEWc3JlgCisuIUo1z4FjyZm8hM0Y",
      "IQoC0uLTVglO9mDPtwzYX2KRc4afU7jE",
      "mNnTYxIKPV0fpX4OEkGyo3hzJ9FUrAad",
      "W3gkdtzOaQBGCMKhTmPsDufL7vyo6b8e",
      "gNuit4H3ah50b1kEndJ6VeWU2mzXD8Gy",
      "X6aWbhsfyBE1lKqDtSO5ZwevcdQM8noJ",
      "7aOqpklKnUFADi1jNgPzouvJGtbs0YW6",
    ];
    var _key = "";
    key += SECRETS[(key.length + msg.length) % 11];
    for (var i = 0; i < key.length; i++) {
      var _k = key.charCodeAt(i);
      _key += _k + i + (_k % 11);
      if (i < key.length - 1) {
        _key += "^";
      }
    }
    var _return = Function(
      "msg",
      decodeURIComponent(
        "var%20_msg%3D%22%22%3B%0Afor(var%20i%3D0%3Bi%3Cmsg.length%3Bi%2B%2B)%7B%0A%20%20%20%20_msg%2B%3DString.fromCharCode(msg.charCodeAt(i)%5E(i%2B1)%5E%7B_key%7D)%3B%0A%7D%0Areturn%20_msg%3B%0A"
      )
        .split("{_key}")
        .join(_key)
    )(msg);
    return new PipedData(_return);
  };
})(
  typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : {}
);

/*
 * USAGE:
 * var originalMessage = "my message text";
 * var result = scramble(originalMessage, "my secret key").raw();
 * console.log(result);
 *
 * scramble(result, "some other key").raw() === originalMessage //false since the key did NOT match.
 * scramble(result, "my secret key").raw() === originalMessage //true since the key MATCHED.
 *
 * For more detailed usage instructions, refer to the README.md file.
 */
