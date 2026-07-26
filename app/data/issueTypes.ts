export interface IssueType {
  id: string;
  title: string;
  titleTe?: string;
  titleHi?: string;
  category: 'leak' | 'pressure' | 'supply' | 'quality' | 'illegal' | 'broken' | 'overflow' | 'connection' | 'bill' | 'emergency';
  icon: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export const ISSUE_TYPES: IssueType[] = [
  {
    id: 'report_leak',
    title: 'Report Leak',
    titleTe: 'లీకేజీ నివేదించండి',
    titleHi: 'रिसाव की रिपोर्ट करें',
    category: 'leak',
    icon: 'droplet-off',
    description: 'Pipeline, valve, or main line water leakage in your street or area.',
    priority: 'HIGH',
  },
  {
    id: 'low_pressure',
    title: 'Low Pressure',
    titleTe: 'తక్కువ పీడనం',
    titleHi: 'कम दबाव',
    category: 'pressure',
    icon: 'gauge',
    description: 'Water flowing at very low pressure during scheduled supply hours.',
    priority: 'MEDIUM',
  },
  {
    id: 'no_water_supply',
    title: 'No Water Supply',
    titleTe: 'నీటి సరఫరా లేదు',
    titleHi: 'पानी की आपूर्ति नहीं',
    category: 'supply',
    icon: 'droplets',
    description: 'No water supply received during scheduled morning/evening hours.',
    priority: 'CRITICAL',
  },
  {
    id: 'dirty_water',
    title: 'Dirty Water',
    titleTe: 'మురికి నీరు',
    titleHi: 'गंदा पानी',
    category: 'quality',
    icon: 'beaker',
    description: 'Discolored, muddy, foul-smelling, or contaminated tap water.',
    priority: 'CRITICAL',
  },
  {
    id: 'illegal_connection',
    title: 'Illegal Connection',
    titleTe: 'అక్రమ కనెక్షన్',
    titleHi: 'अवैध कनेक्शन',
    category: 'illegal',
    icon: 'shield-alert',
    description: 'Unauthorized direct pipe tapping or illegal pump connections.',
    priority: 'HIGH',
  },
  {
    id: 'broken_pipeline',
    title: 'Broken Pipeline',
    titleTe: 'పగిలిన పైప్‌లైన్',
    titleHi: 'टूटी हुई पाइपलाइन',
    category: 'broken',
    icon: 'wrench',
    description: 'Major pipeline break causing severe road flooding or water loss.',
    priority: 'CRITICAL',
  },
  {
    id: 'water_overflow',
    title: 'Water Overflow',
    titleTe: 'నీటి పొంగిపొర్లుట',
    titleHi: 'पानी का अतिप्रवाह',
    category: 'overflow',
    icon: 'waves',
    description: 'Municipal storage tank overflow or valve leakage flooding.',
    priority: 'MEDIUM',
  },
  {
    id: 'request_new_connection',
    title: 'New Connection',
    titleTe: 'కొత్త కనెక్షన్ అభ్యర్థన',
    titleHi: 'नया कनेक्शन अनुरोध',
    category: 'connection',
    icon: 'plus-circle',
    description: 'Apply for residential or commercial domestic tap water connection.',
    priority: 'LOW',
  },
  {
    id: 'water_bill',
    title: 'Water Bill Issue',
    titleTe: 'నీటి బిల్లు సమస్య',
    titleHi: 'पानी का बिल',
    category: 'bill',
    icon: 'receipt',
    description: 'Incorrect billing amount, payment discrepancy, or meter issue.',
    priority: 'LOW',
  },
  {
    id: 'emergency_contact',
    title: 'Emergency Contact',
    titleTe: 'అత్యవసర సంప్రదింపులు',
    titleHi: 'आपातकालीन संपर्क',
    category: 'emergency',
    icon: 'phone-call',
    description: 'Immediate municipal control room escalation for major water crises.',
    priority: 'CRITICAL',
  },
];
