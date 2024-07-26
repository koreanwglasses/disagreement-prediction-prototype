"use client";

import { QueueContainer } from "@/lib/modqueue/components/queue-container";
import { Provider } from "react-redux";
import { store } from "@/lib/modqueue/reducers";

const Modqueue = () => {
  return (
    <Provider store={store}>
      <QueueContainer />
    </Provider>
  );
};
export default Modqueue;
