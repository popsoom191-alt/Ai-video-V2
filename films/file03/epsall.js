// "แสนล้าน" · the whole film (?ep=sall): chapter 1 to the ending, one video.
import s1 from './eps1.js';
import s2 from './eps2.js';
import s3 from './eps3.js';
import s4 from './eps4.js';
import s5 from './eps5.js';
import s6 from './eps6.js';
export default (api) => [...s1(api), ...s2(api), ...s3(api), ...s4(api), ...s5(api), ...s6(api)];
