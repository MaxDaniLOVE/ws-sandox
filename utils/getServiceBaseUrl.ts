export const getServiceBaseUrl = (req: any): string => req.protocol + '://' + req.get('host');