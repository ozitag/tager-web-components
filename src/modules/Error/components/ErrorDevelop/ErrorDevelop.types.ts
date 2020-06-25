export type SentryIssueResponse = {
  title: string;
  file: string;
  sentryUrl: string;
  stacktrace: Array<{
    file: string;
    line: number;
    col: number;
    function: string;
    code: Array<{
      line: string;
      code: string;
    }>;
  }>;
};
