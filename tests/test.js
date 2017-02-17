"use strict";
var tape = require("tape");
var pino = require("pino");
var through2 = require("through2");
var _1 = require("../");
tape('extending works', function (tape) {
    tape.plan(1);
    var pinoInstance = _1.default(pino(through2(function (chunk, enc, callback) {
        console.log(chunk.toString('utf8'));
        tape.true(true);
    })));
    pinoInstance.info('test');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDJCQUE0QjtBQUM1QiwyQkFBNEI7QUFDNUIsbUNBQW9DO0FBQ3BDLHdCQUE0QztBQU81QyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsVUFBQSxJQUFJO0lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDWixJQUFNLFlBQVksR0FBRyxVQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUTtRQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUVKLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFDLENBQUEifQ==