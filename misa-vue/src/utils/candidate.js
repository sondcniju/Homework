import { AVATAR_CLASSES, EMPTY_VALUE } from '@/constants/candidate'

export const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return EMPTY_VALUE
  return String(value)
}

export const formatDate = (value) => {
  if (!value) return EMPTY_VALUE
  const dateOnly = String(value).split('T')[0]
  return dateOnly || EMPTY_VALUE
}

export const getInitials = (name) => {
  if (!name) return EMPTY_VALUE
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return EMPTY_VALUE
  const first = parts[0][0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export const mapCandidates = (items = []) =>
  items.map((item, index) => ({
    id: item.CandidateID ?? `${item.CandidateName}-${index}`,
    name: formatValue(item.CandidateName),
    avatar: getInitials(item.CandidateName || ''),
    avatarClass: AVATAR_CLASSES[index % AVATAR_CLASSES.length],
    pill: null,
    phone: formatValue(item.Mobile),
    source: formatValue(item.ChannelName),
    email: formatValue(item.Email),
    campaign: formatValue(item.RecruitmentCampaignNames),
    position: formatValue(item.JobPositionName),
    recruitment: formatValue(item.RecruitmentName),
    round: formatValue(item.RecruitmentRoundName),
    rating: item.Overall ?? item.Score ?? 0,
    applyDate: formatDate(item.ApplyDate),
    eduLevel: formatValue(item.EducationDegreeName),
    eduSchool: formatValue(item.EducationPlaceName),
    eduMajor: formatValue(item.EducationMajorName),
    recentWorkplace: formatValue(item.WorkPlaceRecent),
    recruiter: formatValue(item.AttractivePersonnel),
    orgUnit: formatValue(item.OrganizationUnitName),
    profileFit: formatValue(item.CandidateStatusName),
    area: formatValue(item.AreaName),
    presenter: formatValue(item.PresenterName),
    intakeInfo: formatValue(item.ProbationInfoStatus),
    rowClass: '',
  }))

export const normalizeCandidateRow = (row, index = 0) => ({
  id: row?.id ?? `cand_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
  name: formatValue(row?.name),
  avatar: getInitials(row?.name || ''),
  avatarClass: row?.avatarClass ?? AVATAR_CLASSES[index % AVATAR_CLASSES.length],
  pill: row?.pill ?? null,
  phone: formatValue(row?.phone),
  source: formatValue(row?.source),
  email: formatValue(row?.email),
  campaign: formatValue(row?.campaign),
  position: formatValue(row?.position),
  recruitment: formatValue(row?.recruitment),
  round: formatValue(row?.round),
  rating: Number(row?.rating ?? 0),
  applyDate: formatValue(row?.applyDate),
  eduLevel: formatValue(row?.eduLevel),
  eduSchool: formatValue(row?.eduSchool),
  eduMajor: formatValue(row?.eduMajor),
  recentWorkplace: formatValue(row?.recentWorkplace),
  recruiter: formatValue(row?.recruiter),
  orgUnit: formatValue(row?.orgUnit),
  profileFit: formatValue(row?.profileFit),
  area: formatValue(row?.area),
  presenter: formatValue(row?.presenter),
  intakeInfo: formatValue(row?.intakeInfo),
  rowClass: row?.rowClass ?? '',
})
