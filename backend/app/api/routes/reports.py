from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models.report import InaccuracyReportModel
from app.schemas.report import InaccuracyReportResponse, InaccuracyReportCreate, ReportStatusUpdate

router = APIRouter(prefix="/reports", tags=["Reports & Quality"])


@router.get("", response_model=List[InaccuracyReportResponse])
def get_reports(
    status: Optional[str] = Query(None, description="تصفية حسب الحالة (pending, approved, rejected)"),
    db: Session = Depends(get_db),
):
    query = db.query(InaccuracyReportModel)
    if status:
        query = query.filter(InaccuracyReportModel.status == status)
    return query.order_by(InaccuracyReportModel.created_at.desc()).all()


@router.post("", response_model=InaccuracyReportResponse, status_code=201)
def submit_report(payload: InaccuracyReportCreate, db: Session = Depends(get_db)):
    if not payload.source_proof_url or not payload.source_proof_url.startswith("http"):
        raise HTTPException(
            status_code=422,
            detail="يلزم تقديم رابط مصدر رسمي صالح يبدأ بـ http:// أو https:// لإثبات التصحيح",
        )

    report_id = f"rep-{uuid.uuid4().hex[:6]}"
    report = InaccuracyReportModel(
        id=report_id,
        status="pending",
        **payload.model_dump(),
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.patch("/{report_id}/status", response_model=InaccuracyReportResponse)
def update_report_status(report_id: str, payload: ReportStatusUpdate, db: Session = Depends(get_db)):
    report = db.query(InaccuracyReportModel).filter(InaccuracyReportModel.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="البلاغ غير موجود")

    report.status = payload.status
    db.commit()
    db.refresh(report)
    return report
