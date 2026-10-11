export const CHILDREN = {
    navigation: { purpose: 'Find architecture concepts', context: 'Reader exploring UCA', parentTo: 'app', dimensions: { width: 'third', height: 'full' } },
    workspace: { purpose: 'Experiment with concepts', context: 'Reader testing examples', parentTo: 'app', dimensions: { width: 'two-thirds', height: 'full' } },
} as const;
export const DISPOSITION = { aim: { description: 'Explain UCA', body: { request: 'Explain UCA', context: 'Desktop reader', parentTo: 'app' } } } as const;
