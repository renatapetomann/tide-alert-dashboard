import { QueryClient, dehydrate, hydrate } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    dehydrate: () => ({ queryClientState: dehydrate(queryClient) }),
    hydrate: (dehydrated) => {
      hydrate(queryClient, dehydrated.queryClientState);
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
