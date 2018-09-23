var app = require("tns-core-modules/application");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");

/**
 * The time duration for which toast will be displayed on the screen
 * For Android the values will be mapped to Toast.LENGTH_LONG and Toast.LENGTH_SHORT
 * For iOS the values will be mapped to the numeric values of Android enum which are 3.5 for LONG and 2 for SHORT
 */
var DURATION = {
  LONG: "long",
  SHORT: "short"
};
exports.DURATION = DURATION;

var POSITION = {
  TOP: 'top',
  BOTTOM: 'bottom',
  CENTER: 'center'
};
exports.POSITION = POSITION;

var globalStyle;

/**
 * show - displays the toast for iOS and Android
 *
 * @param  {object} toastObject javascript object with properties text and duration. Duration by default is short for android.
 * @return {void}
 */
exports.show = function (toastObject) {
  var position;
  return new Promise(function(resolve, reject) {
    if (app.ios) {
      switch (toastObject.position) {
        case POSITION.TOP:
          position = "CSToastPositionTop";
          break;
        case POSITION.CENTER:
          position = "CSToastPositionCenter";
          break;
        default:
          position = "CSToastPositionBottom"; //default position = bottom
      }
      if (toastObject.ios) {
        var style = globalStyle;
        if (!style) {
          style = CSToastStyle.alloc().initWithDefaultStyle();
          style.messageColor = new colorModule.Color(toastObject.color).ios;
          if (!globalStyle && toastObject.useGlobalStyle) {
            globalStyle = style;
            CSToastManager.setSharedStyle(style);
          }
        }
        var image;
        if (toastObject.image) {
          image = UIImage.imageNamed(toastObject.image);
        }
        if (toastObject.tapToDismiss) {
          CSToastManager.setTapToDismissEnabled(true);
        }
        frameModule.topmost().ios.controller.view.makeToastDurationPositionTitleImageStyleCompletion(
          toastObject.text,
          toastObject.duration === DURATION.LONG ? 3.5 : 2.0,
          position,
          toastObject.title || '',
          image,
          style,
          function(didTap) {
            if (didTap) {
              resolve();
            } else {
              reject();
            }
          }
        );
      } else {
        frameModule.topmost().ios.controller.view.makeToastDurationPosition(
          toastObject.text,
          toastObject.duration === DURATION.LONG ? 3.5 : 2.0,
          position
        );
      }
  
    } else if (app.android) {
      switch (toastObject.position) {
        case POSITION.TOP:
          position = android.view.Gravity.TOP;
          break;
        case POSITION.CENTER:
          position = android.view.Gravity.CENTER;
          break;
        default:
          position = android.view.Gravity.BOTTOM; //default position = bottom
      }
      var toast = android.widget.Toast.makeText(
        app.android.context,
        toastObject.text,
        toastObject.duration === DURATION.LONG ? android.widget.Toast.LENGTH_LONG : android.widget.Toast.LENGTH_SHORT
      );
      toast.setGravity(position, 0, 0);
      toast.show();
      resolve();
    }
  });
};

exports.hideAll = function() {
  if (app.ios) {
    frameModule.topmost().ios.controller.view.hideAllToasts();
  }
};
