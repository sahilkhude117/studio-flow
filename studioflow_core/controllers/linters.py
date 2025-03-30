from studioflow_core.contracts_generated import (
    StudioFlowApiEditorLintersCheckResponse,
    StudioFlowApiEditorLintersRule
)
from studioflow_core.linter.rules import rules


def check_linters() -> StudioFlowApiEditorLintersCheckResponse:

    checks = []

    for rule in rules:
        try: 
            checks.append(StudioFlowApiEditorLintersRule.from_dict(rule.to_dict()))
        except Exception:
            pass

    return checks


def fix_linter(rule_name: str, fix_name: str):
    for rule in rules:
        if rule.name == rule_name:
            for issue in rule.find_issues():
                for fix in issue.fixes:
                    if fix.name == fix_name:
                        fix.fix()
                        return True
    raise Exception(f"Could not find fix {fix_name} for rule {rule_name}")


def fix_all_linters():
    for rule in rules:
        if rule.type != "info":
            for issue in rule.find_issues():
                for fix in issue.fixes:
                    fix.fix()
