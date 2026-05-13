export type DashboardSurveyRow = {
  id: string;
  title: string;
  subtitle: string;
  organizer: string;
  endDate: string;
  status: string;
  action: "open" | "edit";
};
