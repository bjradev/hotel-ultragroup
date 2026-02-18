export type Gender = 'male' | 'female' | 'other'

export type DocumentType = 'cc' | 'passport' | 'ce' | 'nit'

export type Guest = {
  fullName: string
  birthDate: Date
  gender: Gender
  documentType: DocumentType
  documentNumber: string
  email: string
  phone: string
}

export type EmergencyContact = {
  fullName: string
  phone: string
}
