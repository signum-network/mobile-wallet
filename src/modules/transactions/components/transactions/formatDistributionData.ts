export function formatDistributionData(jsonString: string): string {
  try {
    const json = JSON.parse(jsonString);

    delete json.height;
    delete json.requestProcessingTime;
    delete json.confirmations;

    return JSON.stringify(json, null, '\t');
  } catch (e) {
    return '[!Attachment Parse Error]';
  }
}
