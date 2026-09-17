"""Analytics service for business logic and calculations."""
from datetime import date, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.analytics_repository import AnalyticsRepository
import cachetools


class AnalyticsService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = AnalyticsRepository(db)
        # Cache for expensive operations (24 hour TTL)
        self.cache = cachetools.TTLCache(maxsize=100, ttl=86400)

    async def get_dashboard_statistics(self, organization_id: str) -> Dict[str, Any]:
        """Get comprehensive dashboard statistics."""
        cache_key = f"dashboard_stats_{organization_id}"
        
        # Check cache first
        if cache_key in self.cache:
            return self.cache[cache_key]

        stats = await self.repository.get_dashboard_stats(organization_id)
        
        # Calculate additional metrics
        stats["active_patients"] = stats["total_patients"]
        
        # Calculate month-over-month changes if we have historical data
        last_month_start = (date.today().replace(day=1) - timedelta(days=32)).replace(day=1)
        stats["last_month_start"] = last_month_start.isoformat()
        
        # Cache the result
        self.cache[cache_key] = stats
        
        return stats

    async def get_prescription_trends(
        self, 
        organization_id: str, 
        months: int = 6
    ) -> Dict[str, Any]:
        """Get prescription trends with analysis."""
        cache_key = f"prescription_trends_{organization_id}_{months}"
        
        if cache_key in self.cache:
            return self.cache[cache_key]

        trends = await self.repository.get_prescription_trends(organization_id, months)
        
        # Calculate trend analysis
        if len(trends) >= 2:
            current = trends[-1]
            previous = trends[-2]
            
            # Calculate percentage change
            if previous["prescriptions"] > 0:
                prescription_change = ((current["prescriptions"] - previous["prescriptions"]) / previous["prescriptions"]) * 100
            else:
                prescription_change = 0
                
            if previous["patients"] > 0:
                patient_change = ((current["patients"] - previous["patients"]) / previous["patients"]) * 100
            else:
                patient_change = 0
        else:
            prescription_change = 0
            patient_change = 0

        result = {
            "trends": trends,
            "analysis": {
                "prescription_change_percent": round(prescription_change, 1),
                "patient_change_percent": round(patient_change, 1),
                "total_months": len(trends)
            }
        }
        
        self.cache[cache_key] = result
        return result

    async def get_diagnosis_distribution(
        self, 
        organization_id: str, 
        limit: int = 10
    ) -> Dict[str, Any]:
        """Get diagnosis distribution with summary."""
        cache_key = f"diagnosis_dist_{organization_id}_{limit}"
        
        if cache_key in self.cache:
            return self.cache[cache_key]

        diagnoses = await self.repository.get_diagnosis_distribution(organization_id, limit)
        
        total_diagnoses = sum(d["count"] for d in diagnoses)
        
        result = {
            "diagnoses": diagnoses,
            "summary": {
                "total_diagnoses": total_diagnoses,
                "unique_diagnoses": len(diagnoses),
                "top_diagnosis": diagnoses[0]["name"] if diagnoses else None
            }
        }
        
        self.cache[cache_key] = result
        return result

    async def get_patient_activity(
        self, 
        organization_id: str, 
        days: int = 30
    ) -> Dict[str, Any]:
        """Get patient activity over time."""
        cache_key = f"patient_activity_{organization_id}_{days}"
        
        if cache_key in self.cache:
            return self.cache[cache_key]

        activities = await self.repository.get_patient_activity(organization_id, days)
        
        total_encounters = sum(a["encounters"] for a in activities)
        avg_encounters = total_encounters / len(activities) if activities else 0
        
        result = {
            "activities": activities,
            "summary": {
                "total_encounters": total_encounters,
                "average_encounters_per_day": round(avg_encounters, 1),
                "days_analyzed": len(activities)
            }
        }
        
        self.cache[cache_key] = result
        return result

    def clear_cache(self, organization_id: Optional[str] = None):
        """Clear cache for specific organization or all."""
        if organization_id:
            keys_to_remove = [key for key in self.cache.keys() if organization_id in key]
            for key in keys_to_remove:
                del self.cache[key]
        else:
            self.cache.clear()