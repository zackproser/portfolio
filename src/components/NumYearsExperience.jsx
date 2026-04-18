export default function RenderNumYearsExperience() {
  return Math.abs(new Date('January 1 2012').getFullYear() - new Date().getFullYear())
}

export function getYearsExperienceAsWord() {
  const years = RenderNumYearsExperience()
  const words = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen', 'Twenty',
  ]
  return words[years] || String(years)
}
