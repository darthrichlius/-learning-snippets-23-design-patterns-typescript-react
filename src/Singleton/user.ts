import { singletonCounterObject } from "./Singleton";

const counter = singletonCounterObject;

counter.increment();

export default counter;