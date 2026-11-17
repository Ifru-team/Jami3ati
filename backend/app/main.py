from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router
from app.core.database import Base, engine

# Create tables in dev if not already created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    ## دليل الخدمات والمعلومات الجامعية بالمغرب (جامعتي | Jami3ati)
    API موثق تلقائيًا يعتمد على البيانات المفتوحة والمصادر الرسمية المنشورة.
    
    ### مبادئ البيانات:
    - **أولوية البيانات المفتوحة**: بيانات data.gov.ma وبوابات الجامعات.
    - **صفر تخمين**: عدم توليد أي أرقام أو إيميلات غير موثقة.
    - **توثيق المصدر وتاريخ المراجعة**: لكل سجل `source_url` و`source_name` و`verified_at`.
    - **حالات التوثيق**: `verified` (موثق)، `needs_review` (قيد المراجعة)، `demo` (تجريبي).
    """,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "message": "مرحبًا بكم في واجهة برمجة تطبيقات جامعتي | Jami3ati API",
        "docs": f"{settings.API_V1_STR}/docs",
        "health": f"{settings.API_V1_STR}/health",
    }
