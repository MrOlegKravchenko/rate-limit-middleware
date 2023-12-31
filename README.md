# rate-limit-middleware
Middleware to limit requests by user.


It is easy customize your own values in [src/constants](./src/constants/index.ts):
- <strong>"maxRequests"</strong>
- <strong>"interval"</strong>;
- <strong>"haltTime"</strong>;

# How it works:
- Wait until <strong>"maxRequests"</strong> request, let's say 100;
- Checking the diff between last request's receive time and request's receive time 100 before;
- If delta is less than predefine <strong>"interval"</strong>, so it means that requests are too frequent;
- Requests will be halt for <strong>"haltTime"</strong> seconds for that User;


> It is also self-cleaning, leaving only last "maxRequests" requests, e.g. 100;

Demo:
> https://github.com/MrOlegKravchenko/rate-limit-middleware/assets/44597516/216470b5-aa0f-4c1c-86e1-05730d2e38c7
