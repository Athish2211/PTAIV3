"""
Models __init__ — imports all models so Alembic and SQLAlchemy discover them.
"""
from app.models.base import Base, TimeStampedModel
from app.models.organization import Organization
from app.models.user import User, RefreshToken, PasswordResetToken
from app.models.patient import Patient, PatientIdentifier
from app.models.encounter import Encounter
from app.models.vitals import Vitals
from app.models.diagnosis import Diagnosis
from app.models.medication import Medication
from app.models.prescription import Prescription, PrescriptionItem
from app.models.clinical_note import ClinicalNote
from app.models.document import Document, DocumentChunk
from app.models.prescription_upload import PrescriptionUpload
from app.models.external_dataset import ExternalDataset
from app.models.follow_up import FollowUp
from app.models.ai_conversation import AIConversation, AIMessage
from app.models.analytics import AnalyticsRun, AnalyticsResult, AnalyticsEvidence, ModelRun
from app.models.audit import AuditLog, SecurityEvent

__all__ = [
    "Base", "TimeStampedModel",
    "Organization",
    "User", "RefreshToken", "PasswordResetToken",
    "Patient", "PatientIdentifier",
    "Encounter",
    "Vitals",
    "Diagnosis",
    "Medication",
    "Prescription", "PrescriptionItem",
    "ClinicalNote",
    "Document", "DocumentChunk",
    "PrescriptionUpload",
    "ExternalDataset",
    "FollowUp",
    "AIConversation", "AIMessage",
    "AnalyticsRun", "AnalyticsResult", "AnalyticsEvidence", "ModelRun",
    "AuditLog", "SecurityEvent",
]
