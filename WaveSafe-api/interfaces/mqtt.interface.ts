export enum Events{
    CONNECT_EVENT = 'connect',
    ERROR_EVENT = 'error',
    MESSAGE_EVENT = 'message',
    NO_MESSAGE_HANDLER = `There is no matching message handler defined in the remote service.`
}
export const RQM_NO_MESSAGE_HANDLER = (
    _text: TemplateStringsArray,
    pattern: string,
  ) =>
    `An unsupported message was received. It has been negative acknowledged, so it will not be re-delivered. Pattern: ${pattern}`;